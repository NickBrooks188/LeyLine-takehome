from flask import Blueprint, session, request
from ..models import db, Settlement
from ..forms import SettlementForm

settlement = Blueprint('settlement', __name__)

@settlement.route('', methods=['GET'])
def get_settlement():
    settlement = Settlement.query.all()[0]
    return { settlement.to_dict() }

@settlement.route('', methods=['POST'])
def create_settlement():
    settlement = Settlement.query.all()[0]
    if settlement:
        return {'errors': 'Settlement already exists'}, 401
    form = SettlementForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_settlement = Settlement(
            amount = data["amount"],
            status = data["status"],
        )
        db.session.add(new_settlement)
        db.session.commit()
        return new_settlement.to_dict()
    return {'errors': form.errors}, 401

@settlement.route('', methods=['PUT'])
def edit_settlement():
    form = SettlementForm()
    settlement = Settlement.query.all()[0]
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        settlement.amount = data['amount']
        settlement.status = data['status']
        db.session.commit()
        return settlement.to_dict()
    return {'errors': form.errors}, 401

@settlement.route('', methods=['DELETE'])
def delete_server():
    settlement = Settlement.query.all()[0]
    if settlement:
        db.session.delete(settlement)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
